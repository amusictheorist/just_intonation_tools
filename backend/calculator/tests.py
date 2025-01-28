from django.test import TestCase
import unittest
from unittest.mock import patch
import builtins
from .utils import par_to_parc, ratio_to_cents, create_set, transpose, ERROR_MESSAGES

class ParToParcTests(TestCase):
    def test_invalid_type(self):
        """Test that a non-integer input raises a ValueError."""
        with self.assertRaises(ValueError) as context:
            par_to_parc('string')
            self.assertEqual(str(context.exception), ERROR_MESSAGES.invalid_positive_integer)

    def test_non_positive_integer(self):
        """Test that non-positive integers raise a ValueError."""
        with self.assertRaises(ValueError) as context:
            par_to_parc(0)
            self.assertEqual(str(context.exception), ERROR_MESSAGES.invalid_positive_integer)

        with self.assertRaises(ValueError) as context:
            par_to_parc(-5)
            self.assertEqual(str(context.exception), ERROR_MESSAGES.invalid_positive_integer)

class RatioToCentsTests(TestCase):

    def test_invalid_type(self):
        """Test that non-positive integer input raises a ValueError."""
        with self.assertRaises(ValueError) as context:
            ratio_to_cents('1', 2)
            self.assertEqual(str(context.exception), ERROR_MESSAGES.invalid_two_positive_integers)

        with self.assertRaises(ValueError) as context:
            ratio_to_cents(1.0, 2)
            self.assertEqual(str(context.exception), ERROR_MESSAGES.invalid_two_positive_integers)

        with self.assertRaises(ValueError) as context:
            ratio_to_cents(-1, 2)
            self.assertEqual(str(context.exception), ERROR_MESSAGES.invalid_two_positive_integers)

    def test_invalid_value(self):
        """Test that non-positive integers raise a ValueError."""
        with self.assertRaises(ValueError) as context:
            ratio_to_cents(1, -2)
            self.assertEqual(str(context.exception), ERROR_MESSAGES.invalid_two_positive_integers)

        with self.assertRaises(ValueError) as context:
            ratio_to_cents(0, 2)
            self.assertEqual(str(context.exception), ERROR_MESSAGES.invalid_two_positive_integers)

    def test_valid_ratio(self):
        """Test that valid positive integer inputs return the expected result."""
        self.assertEqual(ratio_to_cents(100, 50), 1200.00)
        self.assertEqual(ratio_to_cents(200, 100), 1200.00)

    def test_edge_case(self):
        """Test edge cases for input values."""
        self.assertEqual(ratio_to_cents(2, 1), 1200.00)
        self.assertEqual(ratio_to_cents(3, 2), 701.96)
        self.assertEqual(ratio_to_cents(4, 3), 498.04)
        self.assertEqual(ratio_to_cents(5,4), 386.31)
        self.assertEqual(ratio_to_cents(6,5), 315.64)
        self.assertEqual(ratio_to_cents(7,6), 266.87)
        self.assertEqual(ratio_to_cents(8,7), 231.17)

class CreateSetTests(unittest.TestCase):

    def test_invalid_input(self):
        """Test that non-integer inputs return an error message."""
        with patch.object(builtins, 'input', return_value="5 three 7"):
            result = create_set()
            self.assertEqual(result, ERROR_MESSAGES.invalid_set_integers)

    def test_negative_integers(self):
        """Test that negative integers are rejected."""
        with patch.object(builtins, 'input', return_value="-1 2 -3 4"):
            result = create_set()
            self.assertEqual(result, ERROR_MESSAGES.invalid_set_integers)

    def test_valid_input(self):
        """Test that valid integer inputs create a sorted set."""
        with patch.object(builtins, 'input', return_value="5 3 7 3 2 9"):
            result = create_set()
            self.assertEqual(result, {2, 3, 5, 7, 9})

    def test_single_input(self):
        """Test that single-integer input is correctl handled."""
        with patch.object(builtins, 'input', return_value="42"):
            result = create_set()
            self.assertEqual(result, {42})

    def test_empty_input(self):
        """Test that empty input returns an error message."""
        with patch.object(builtins, 'input', return_value=""):
            result = create_set()
            self.assertEqual(result, ERROR_MESSAGES.empty_set)

    def test_spaces_only(self):
        """Test that input with only spaces returns an error message."""
        with patch.object(builtins, 'input', return_value="   "):
            result = create_set()
            self.assertEqual(result, ERROR_MESSAGES.empty_set)

    def test_duplicate_integers(self):
        """Test that duplicate integers are removed in the returned set."""
        with patch.object(builtins, 'input', return_value="5 5 5 5 "):
            result = create_set()
            self.assertEqual(result, {5})

    def test_large_integers(self):
        """Test that the function handles large integers."""
        with patch.object(builtins, 'input', return_value="1000000 5000000 30000000"):
            result = create_set()
            self.assertEqual(result, {1000000, 5000000, 30000000})

    def test_leading_zeroes(self):
        """Test that integers with leading zeroes are handled correctly."""
        with patch.object(builtins, 'input', return_value="007 0042 100"):
            result = create_set()
            self.assertEqual(result, {7, 42, 100})

    def test_large_set(self):
        """Test that a large set of integers is handled correctly."""
        large_input = " ".join(str(i) for i in range(1, 10001))
        with patch.object(builtins, 'input', return_value=large_input):
            result = create_set()
            self.assertEqual(len(result), 10000)
            self.assertEqual(min(result), 1)
            self.assertEqual(max(result), 10000)

    def test_mixed_delimiters(self):
        """Test that mixed delimiters are not accepted."""
        with patch.object(builtins, 'input', return_value="1, 2, 3; 4 5"):
            result = create_set()
            self.assertEqual(result, ERROR_MESSAGES.invalid_set_integers)

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