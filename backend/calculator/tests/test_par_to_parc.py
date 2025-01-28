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