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

if __name__ == '__main__':
    unittest.main()