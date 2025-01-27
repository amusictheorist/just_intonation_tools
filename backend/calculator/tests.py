from django.test import TestCase
from .utils import par_to_parc, ratio_to_cents

class ParToParcTests(TestCase):

  def test_invalid_type(self):
    """Test that a non-integer input returns an error message."""
    self.assertEqual(par_to_parc('string'), 'Invalid input, please enter a positive integer')

  def test_non_positive_integer(self):
    """Test that non-positive integers return an error message."""
    self.assertEqual(par_to_parc(0), 'Invalid input, please enter a positive integer')
    self.assertEqual(par_to_parc(-5), 'Invalid input, please enter a positive integer')

  def test_odd_integer(self):
    """Test that an odd integer returns the same value. """
    self.assertEqual(par_to_parc(5), 5)
    self.assertEqual(par_to_parc(11), 11)

  def test_even_integer(self):
    """Test that an even intefer is divided by 2 recursively until odd."""
    self.assertEqual(par_to_parc(8), 1)
    self.assertEqual(par_to_parc(12), 3)
    self.assertEqual(par_to_parc(40), 5)

class RatioToCentsTests(TestCase):

  def test_invalid_type(self):
    """"Test that a non-positive integer input raises a ValueError."""
    with self.assertRaises(ValueError):
      ratio_to_cents('1', 2)
    
    with self.assertRaises(ValueError):
      ratio_to_cents(1.0, 2)

    with self.assertRaises(ValueError):
      ratio_to_cents(-1, 2)

  def test_invalid_value(self):
    """Test that non-positive integers raise a ValueError."""
    with self.assertRaises(ValueError):
      ratio_to_cents(1, -2)

    with self.assertRaises(ValueError):
      ratio_to_cents(0, 2)

  def test_valid_ratio(self):
    """Test that valid positive integer inputs return the expected result."""
    self.assertEqual(ratio_to_cents(100, 50), 1200.00)
    self.assertEqual(ratio_to_cents(200, 100), 1200.00)