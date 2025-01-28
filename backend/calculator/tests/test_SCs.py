import unittest
from unittest.mock import patch
from calculator.utils import parSC, ERROR_MESSAGES

class ParSCTests(unittest.TestCase):

    def test_input_set_not_a_set(self):
        """Test that an error is raised if input set is not a set."""
        with self.assertRaises(TypeError) as context:
            parSC([1, 2, 3])
            self.assertEqual(str(context.exception), ERROR_MESSAGES.invalid_set)

    def test_input_set_contains_non_integers(self):
        """Test that an error is raised if input set contains non-integers."""
        with self.assertRaises(ValueError) as context:
            parSC({1, 'a', 3})
            self.assertEqual(str(context.exception), ERROR_MESSAGES.invalid_set_integers)

    def test_empty_set(self):
        """test that an empty set raises an error."""
        with self.assertRaises(ValueError) as context:
            parSC(set())
            self.assertEqual(str(context.exception), ERROR_MESSAGES.empty_set)

    def test_0_in_input(self):
        """Test that input sets containing 0 raise an error."""
        with self.assertRaises(ValueError) as context:
            parSC({0, 1, 2})
            self.assertEqual(str(context.exception), ERROR_MESSAGES.empty_set)