import unittest
from ..partial_sets import PartialSet

class TestPartialSet(unittest.TestCase):

    def test_initialization_valid(self):
        """Test that a partial set initializes with valid inputs."""
        valid_set1 = PartialSet([2, 4, 6, 8])
        valid_set2 = PartialSet({2, 4, 6, 8})
        valid_set3 = PartialSet((2, 4, 6, 8))
        self.assertEqual(valid_set1, {2, 4, 6, 8})
        self.assertEqual(valid_set2, {2, 4, 6, 8})
        self.assertEqual(valid_set3, {2, 4, 6, 8})

    def test_initialization_invalid(self):
        """Test that a partial set raises an error for invalid inputs."""
        with self.assertRaises(ValueError):
            PartialSet([2, 4, 6, -8])
        
        with self.assertRaises(ValueError):
            PartialSet([2, 4, 6, 7.5])
        
        with self.assertRaises(TypeError):
            PartialSet('invalid')

    def test_duplicate_elements(self):
        """Test that duplicate elements are removed."""
        set = PartialSet([2, 4 ,4, 6, 6, 8])
        self.assertEqual(set, {2, 4, 6, 8})