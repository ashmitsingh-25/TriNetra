import unittest
import numpy as np
from fastapi.testclient import TestClient
import main


class BackendTests(unittest.TestCase):
    def setUp(self):
        main.API_KEY = ''
        main.FRAUD_CLASS = ''
        self.context = TestClient(main.app)
        self.client = self.context.__enter__()

    def tearDown(self):
        self.context.__exit__(None, None, None)

    def test_prediction_matches_original(self):
        text = 'URGENT pay your pending electricity bill immediately'
        result = self.client.post('/predict', json={'messageText': text})
        self.assertEqual(result.status_code, 200)
        data = result.json()
        np.testing.assert_allclose(list(data['class_probabilities'].values()), main.model.predict_proba([text])[0])
        self.assertEqual(data['predicted_class'], str(main.model.predict([text])[0]))
        self.assertIsNone(data['fraud_probability'])
        self.assertIsNone(data['riskTier'])

    def test_configured_mapping(self):
        main.FRAUD_CLASS = '1'
        data = self.client.post('/predict', json={'messageText': 'Sample message'}).json()
        self.assertEqual(data['fraud_probability'], data['class_probabilities']['1'])
        self.assertEqual(data['score'], round(data['fraud_probability'] * 100, 2))
        self.assertIn(data['riskTier'], ['LOW', 'MEDIUM', 'HIGH'])

    def test_validation(self):
        for body in [{}, {'messageText': ''}, {'messageText': '  '}, {'messageText': 3}, {'messageText': 'x'*10001}, {'messageText': 'ok', 'url': 'extra'}]:
            self.assertEqual(self.client.post('/predict', json=body).status_code, 422)

    def test_authentication(self):
        main.API_KEY = 'test-only-secret'
        self.assertEqual(self.client.post('/predict', json={'messageText': 'hello'}).status_code, 401)
        self.assertEqual(self.client.post('/predict', json={'messageText': 'hello'}, headers={'X-API-Key': 'wrong'}).status_code, 401)
        self.assertEqual(self.client.post('/predict', json={'messageText': 'hello'}, headers={'X-API-Key': main.API_KEY}).status_code, 200)

    def test_health_docs_cors(self):
        self.assertTrue(self.client.get('/health').json()['model_loaded'])
        self.assertEqual(self.client.get('/docs').status_code, 200)
        response = self.client.options('/predict', headers={'Origin': 'http://localhost:3000', 'Access-Control-Request-Method': 'POST'})
        self.assertEqual(response.headers['access-control-allow-origin'], 'http://localhost:3000')


if __name__ == '__main__':
    unittest.main()
