from django.test import TestCase
from calculator.utils import ratio_to_cents, ERROR_MESSAGES

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