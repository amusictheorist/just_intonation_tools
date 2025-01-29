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

if __name__ == '__main__':
    unittest.main()