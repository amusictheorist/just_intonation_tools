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

    def test_valid_input(self):
        """Test that a valid input does not raise an error."""
        try:
            low_inverse({4, 5, 6})
        except Exception as e:
            self.fail(f"Low inverse raised {type(e).__name__} unexpectedly: {e}")

    def test_valid_inversion(self):
        """Test that a set is correctly transformed to its low inverse."""
        self.assertEqual(low_inverse({4, 5, 6}), {10, 12, 15})
        self.assertEqual(low_inverse({4, 5, 6, 7}), {60, 70, 84, 105})
        self.assertEqual(low_inverse({1, 3, 5}), {3, 5, 15})
        self.assertEqual(low_inverse({1, 3, 5, 7}), {15, 21, 35, 105})

    def test_dyad_inversion(self):
        """Test that an inverted interval returns itself."""
        self.assertEqual(low_inverse({4, 5}), {4, 5})

    def test_duplicates(self):
        """Test that duplicates in input don't affect result."""
        self.assertEqual(low_inverse({4, 4, 5, 5, 6}), {10, 12, 15})

    def test_prime_numbers(self):
        """Test that prime number sets are correctly inverted."""
        self.assertEqual(low_inverse({2, 3, 5, 7}), {30, 42, 70, 105})
        self.assertEqual(low_inverse({11, 13, 17}), {143, 187, 221})

    def test_involution(self):
        """Test that performing low_inverse twice in a row returns the initial set."""
        initial = ({4, 5, 6})
        inverted = low_inverse(initial)
        self.assertEqual(initial, low_inverse(inverted))

    def test_single_element(self):
        """Test that attempting to innvert a single element raises an error."""
        with self.assertRaises(ValueError) as context:
            low_inverse({7})
            self.assertEqual(str(context.exception), ERROR_MESSAGES.invalid_inversion)

if __name__ == '__main__':
    unittest.main()