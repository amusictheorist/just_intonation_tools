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
            PartialSet([2, 4, 6, -8])  # Negative element
        
        with self.assertRaises(ValueError):
            PartialSet([2, 4, 6, 7.5])  # Non-integer element
        
        with self.assertRaises(TypeError):
            PartialSet('invalid')  # Invalid type for initialization

        with self.assertRaises(ValueError):
            PartialSet([])  # Empty set should raise a ValueError

    def test_duplicate_elements(self):
        """Test that duplicate elements are removed."""
        set = PartialSet([2, 4 ,4, 6, 6, 8])
        self.assertEqual(set, {2, 4, 6, 8})

    def test_set_operations(self):
        """Test common set operations."""
        set1 = PartialSet([2, 4, 6])
        set2 = PartialSet([4, 6, 8])

        # Union
        self.assertEqual(set1 | set2 , {2, 4, 6, 8})

        # Intersection
        self.assertEqual(set1 & set2, {4, 6})

        # Difference
        self.assertEqual(set1 - set2, {2})
        self.assertEqual(set2 - set1, {8})

    def test_is_subclass_of_set(self):
        """Test that a partial set is a subclass of set."""
        partial_set = PartialSet([2, 4, 6, 8])
        self.assertTrue(isinstance(partial_set, set))

    def test_large_set(self):
        """Test that PartialSet handles large sets correctly."""
        large_set = PartialSet(range(1, 10001))
        self.assertEqual(len(large_set), 10000)

if __name__ == '__main__':
    unittest.main()