import unittest
from calculator.utils import low_inverse, ERROR_MESSAGES

class InversionTests(unittest.TestCase):

    def test_input_set_not_a_set(self):
        """test that an error is raised if input set is not a set."""
        with self.assertRaises(TypeError) as context:
            low_inverse(4, 5, 6)
            self.assertEqual(str(context.exception), ERROR_MESSAGES.invalid_set)