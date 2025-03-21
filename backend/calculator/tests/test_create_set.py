import unittest
from unittest.mock import patch
import builtins
from calculator.utils import create_set, ERROR_MESSAGES

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