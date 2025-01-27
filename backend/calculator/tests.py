from django.test import TestCase
from .utils import par_to_parc

class ParToParcTests(TestCase):

  def test_invalid_type(self):
    """Test that a non-integer input returns an error message."""
    self.assertEqual(par_to_parc('string'), 'Invalid input, please enter a positive integer')