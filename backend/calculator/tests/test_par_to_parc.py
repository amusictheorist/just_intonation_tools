from django.test import TestCase
from calculator.utils import par_to_parc, ERROR_MESSAGES

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

    def test_valid_inputs(self):
        """Test that valid integer inputs produce expected results."""
        self.assertEqual(par_to_parc(16), 1)
        self.assertEqual(par_to_parc(35), 35)

    def test_valid_input(self):
        """Test that valid integers don't raise errors."""
        try:
            par_to_parc(16)
        except Exception as e:
            self.fail(f"par_to_parc raised {type(e).__name__} unexpectedly: {e}")