import unittest
from calculator.partial_sets import PartialSet, PartialClassSet, PartialSetClass

class TestPartialSetClass(unittest.TestCase):

    def test_initialization_invalid(self):
        """Test that a partial-set class raises an error for invalid inputs."""
        with self.assertRaises(TypeError):
            PartialSetClass([1, 2, 3])

        with self.assertRaises(TypeError):
            PartialSetClass('invalid')

        with self.assertRaises(TypeError):
            PartialSetClass(PartialClassSet([1, 3, 5]))

        with self.assertRaises(TypeError):
            PartialSetClass(42)

    def test_initialize_valid(self):
        """Test that a partial-set class initializes correctly with a partial set."""
        partial_set = PartialSet([4, 5, 6, 7])
        set_class = PartialSetClass(partial_set)

        self.assertIsInstance(set_class, PartialSetClass)
        self.assertEqual(set_class.representative_set, partial_set)

if __name__ == '__main__':
    unittest.main()