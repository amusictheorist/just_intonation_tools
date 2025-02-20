import unittest
from calculator.utils import low_inverse, ERROR_MESSAGES

class InversionTests(unittest.TestCase):

    def test_input_set_not_a_set(self):
        """Test that an error is raised if input set is not a set."""
        with self.assertRaises(TypeError) as context:
            low_inverse('4, 5, 6')
            self.assertEqual(str(context.exception), ERROR_MESSAGES.invalid_set)

    def test_non_integer_input(self):
        """Test that an error is raised if input set contains negative or non-integer values."""
        with self.assertRaises(ValueError) as context:
            low_inverse({1, 2.5, 'a', -4})
            self.assertEqual(str(context.exception), ERROR_MESSAGES.invalid_set_integers)

    def test_empty_set(self):
        """Test that an empty set raises an error message."""
        with self.assertRaises(ValueError) as context:
            low_inverse(set())
            self.assertEqual(str(context.exception), ERROR_MESSAGES.empty_set)

if __name__ == '__main__':
    unittest.main()