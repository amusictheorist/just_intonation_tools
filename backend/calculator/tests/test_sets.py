import unittest
from ..partial_sets import PartialSet, PartialClassSet

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

        with self.assertRaises(ValueError):
            PartialSet([])

    def test_duplicate_elements(self):
        """Test that duplicate elements are removed."""
        set = PartialSet([2, 4 ,4, 6, 6, 8])
        self.assertEqual(set, {2, 4, 6, 8})

    def test_set_operations(self):
        """Test common set operations."""
        set1 = PartialSet([2, 4, 6])
        set2 = PartialSet([4, 6, 8])

        # Union
        self.assertEqual(set1 | set2, {2, 4, 6, 8})

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

    def test_set_equality(self):
        """Test equality comparison between two sets."""
        set1 = PartialSet([2, 4, 6, 8])
        set2 = PartialSet([2, 4, 6, 8])
        set3 = PartialSet([1, 2, 3])
        self.assertEqual(set1, set2)
        self.assertNotEqual(set1, set3)

class TestPartialClassSet(unittest.TestCase):

    def test_initialization_valid(self):
        """Test that a partial-class set initializes with valid odd positive integers."""
        set1 = PartialClassSet([1, 3, 5, 7])
        set2 = PartialClassSet({9, 11, 13})
        set3 = PartialClassSet((17, 15, 19))
        self.assertEqual(set1, {1, 3, 5, 7})
        self.assertEqual(set2, {9, 11, 13})
        self.assertEqual(set3, {15, 17, 19})

    def test_initialization_invalid(self):
        """Test that a partial-class set raises an error for invalid inputs."""
        with self.assertRaises(ValueError):
            PartialClassSet([2, 4, 6, -8])

        with self.assertRaises(ValueError):
            PartialClassSet([2, 4, 6, 7.5])

        with self.assertRaises(TypeError):
            PartialClassSet('invalid')

        with self.assertRaises(ValueError):
            PartialClassSet([])

    def test_string_representation(self):
        """Test that the string representation correctly underlines numbers."""
        set = PartialClassSet([1, 3, 5, 7])
        self.assertEqual(str(set), '{_1_, _3_, _5_, _7_}')

    def test_duplicate_elements(self):
        """Test that duplicate elements are removed."""
        set = PartialClassSet([1, 3, 3, 5, 5, 7])
        self.assertEqual(set, {1, 3, 5, 7})

    def test_set_operations(self):
        """Test common set operations."""
        set1 = PartialClassSet([1, 3, 5])
        set2 = PartialClassSet([3, 5, 7])

        # Union
        self.assertEqual(set1 | set2, {1, 3, 5, 7})

        # Intersection
        self.assertEqual(set1 & set2, {3, 5})

        # Difference
        self.assertEqual(set1 - set2, {1})
        self.assertEqual(set2 - set1, {7})

    def test_is_subclass_of_set(self):
        """Test that a partial-class set is a subclass of set."""
        partial_class_set = PartialClassSet([1, 3, 5])
        self.assertTrue(partial_class_set, set)

    def test_large_set(self):
        """test that PartialClassSet handles large sets correctly."""
        large_set = PartialClassSet(range(1, 10001, 2))
        self.assertEqual(len(large_set), 5000)

    def test_set_equality(self):
        """Test equality comparison between two sets."""
        set1 = PartialClassSet([1, 3, 5, 7])
        set2 = PartialClassSet([1, 3, 5, 7])
        set3 = PartialClassSet([1, 3, 5])
        self.assertEqual(set1, set2)
        self.assertNotEqual(set1, set3)

if __name__ == '__main__':
    unittest.main()