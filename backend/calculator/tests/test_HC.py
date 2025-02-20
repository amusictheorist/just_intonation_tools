import unittest
from calculator.partial_sets import PartialSet, PartialClassSet, PartialSetClass, PartialClassSetClass

class TestPartialSetClassHC(unittest.TestCase):

    def test_partial_set_HCp(self):
        """Test that HCp of a partial set is properly calculated."""
        partial_set = PartialSet({8, 10, 12, 14})
        expected_sum = sum({4, 5, 6, 7})
        partial_set_class = PartialSetClass(partial_set)

        self.assertEqual(partial_set_class.HCp(), expected_sum)
        self.assertEqual(partial_set.HCp(), expected_sum)

    def test_partial_class_set_HCpc(self):
        """Test that HCpc of a partial-class set is properly calculated."""
        partial_class_set = PartialClassSet({9, 15, 21})
        expected_sum = sum({3, 5, 7})
        partial_class_set_class = PartialClassSetClass(partial_class_set)

        self.assertEqual(partial_class_set_class.HCpc(), expected_sum)
        self.assertEqual(partial_class_set.HCpc(), expected_sum)

if __name__ == '__main__':
    unittest.main()