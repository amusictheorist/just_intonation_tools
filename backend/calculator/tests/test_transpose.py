import unittest
from unittest.mock import patch
from calculator.utils import transpose, ERROR_MESSAGES

class TransposeTests(unittest.TestCase):
    
    def test_input_set_not_a_set(self):
        """Test that an error is raised if input set is not a set."""
        with self.assertRaises(TypeError) as context:
            transpose([1, 2, 3], 5)
            self.assertEqual(str(context.exception), ERROR_MESSAGES.invalid_set)

    def test_n_not_a_positive_integer(self):
        """Test that an error is raised if n is not a positive integer."""
        with self.assertRaises(ValueError) as context:
            transpose({1, 2, 3}, -1)
            self.assertEqual(str(context.exception), ERROR_MESSAGES.invalid_set_integers)
        with self.assertRaises(ValueError) as context:
            transpose({1, 2, 3}, 0)
            self.assertEqual(str(context.exception), ERROR_MESSAGES.invalid_set_integers)
        with self.assertRaises(ValueError) as context:
            transpose({1, 2, 3}, "5")
            self.assertEqual(str(context.exception), ERROR_MESSAGES.invalid_set_integers)

    def test_input_set_contains_non_integers(self):
        """Test that an error is raised if input set contains non-integer values."""
        with self.assertRaises(ValueError) as context:
            transpose({1, 2.5, 'a', -4}, 3)
            self.assertEqual(str(context.exception), ERROR_MESSAGES.invalid_set_integers)

    def test_valid_inputs(self):
        """Test that valid inputs do not raise errors."""
        try:
            transpose({1, 2, 3}, 5)
        except Exception as e:
            self.fail(f"transpose raised {type(e).__name__} unexpectedly: {e}")

    def test_valid_transposition(self):
        """Test that valid inputs are correctly transposed."""
        self.assertEqual(transpose({1, 2, 3}, 3), {3, 6, 9})
        self.assertEqual(transpose({4, 5, 6, 7}, 4), {16, 20, 24, 28})
        self.assertEqual(transpose({3, 7, 12, 19, 24}, 7), {21, 49, 84, 133, 168})
      
    def test_identity(self):
        """Test that transposition by n=1 returns the same set."""
        self.assertEqual(transpose({3, 4, 5}, 1), {3, 4, 5})

    def test_duplicates_in_input(self):
        """Test that duplicates in the input set do not affect the result."""
        self.assertEqual(transpose({1, 1, 2, 3, 3}, 2), {2, 4, 6})

    def test_empty_set(self):
        """Test that an empty set raises an error message."""
        with self.assertRaises(ValueError) as context:
            transpose(set(), 5)
            self.assertEqual(str(context.exception), ERROR_MESSAGES.empty_set)

    def test_0_in_input_set(self):
        """Test that input sets containing 0 raise an error."""
        with self.assertRaises(ValueError) as context:
            transpose({0, 1, 2}, 5)
            self.assertEqual(str(context.exception), ERROR_MESSAGES.invalid_set_integers)

        with self.assertRaises(ValueError) as context:
            transpose({0}, 5)
            self.assertEqual(str(context.exception), ERROR_MESSAGES.invalid_set_integers)