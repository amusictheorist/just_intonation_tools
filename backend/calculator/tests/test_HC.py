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

    def test_cardinality_HCp(self):
        """Test that #HCp of a partial set is properly calculated."""
        partial_set = PartialSet({8, 10, 12, 14})
        expected_result = round(sum({4, 5, 6, 7})/10, 2)
        partial_set_class = PartialSetClass(partial_set)

        self.assertEqual(partial_set_class.cardHCp(), expected_result)
        self.assertEqual(partial_set.cardHCp(), expected_result)

    def test_cardinality_HCpc(self):
        """Test that #HCpc of a partial-class set is properly calculated."""
        partial_class_set = PartialClassSet({9, 15, 21})
        expected_result = round(sum({3, 5, 7})/9, 2)
        partial_class_set_class = PartialClassSetClass(partial_class_set)

        self.assertEqual(partial_class_set_class.cardHCpc(), expected_result)
        self.assertEqual(partial_class_set.cardHCpc(), expected_result)

    def test_single_element_HCp(self):
        """Test HCp for a single-element set."""
        partial_set = PartialSet({7})
        expected_sum = sum({1})
        self.assertEqual(partial_set.HCp(), expected_sum)
    
    def test_single_element_HCpc(self):
        """Test HCpc for a single-element set."""
        partial_class_set = PartialClassSet({7})
        expected_sum = sum({1})
        self.assertEqual(partial_class_set.HCpc(), expected_sum)

    def test_prime_number_HCp(self):
        """Test HCp for a set of prime numbers."""
        partial_set = PartialSet({3, 5, 7})
        expected_sum = sum({3, 5, 7})
        self.assertEqual(partial_set.HCp(), expected_sum)

    def test_single_element_cardHCp(self):
        """Test #HCp for a single-element set."""
        partial_set = PartialSet({10})
        expected_result = round(sum({1})/1, 2)
        self.assertEqual(partial_set.cardHCp(), expected_result)
    
    def test_single_element_cardHCpc(self):
        """Test #HCpc for a single-element set."""
        partial_class_set = PartialClassSet({11})
        expected_result = round(sum({1})/1, 2)
        self.assertEqual(partial_class_set.cardHCpc(), expected_result)

    def test_large_set_cardHC(self):
        """Test that #HC scales correctly with large sets."""
        partial_set = PartialSet({10, 20, 30, 40, 50, 60, 70, 80})
        partial_class_set = PartialClassSet({3, 9, 15, 21, 27, 33, 39, 45})
        expected_parSC = ({1, 2, 3, 4, 5, 6, 7, 8})
        expected_parcSC = ({1, 3, 5, 7, 9, 11, 13, 15})
        expected_cardHCp = round(sum(expected_parSC)/36, 2)
        expected_cardHCpc = round(sum(expected_parcSC)/64, 2)

        self.assertEqual(partial_set.cardHCp(), expected_cardHCp)
        self.assertEqual(partial_class_set.cardHCpc(), expected_cardHCpc)

    def test_HC_class_equivalence(self):
        """Test that HC is the same for different sets in the same class."""
        partial_set1 = PartialSet({4, 5, 6})
        partial_set2 = PartialSet({8, 10, 12})
        partial_class_set1 = PartialClassSet({1, 3, 5})
        partial_class_set2 = PartialClassSet({5, 15, 25})

        self.assertEqual(partial_set1.HCp(), partial_set2.HCp())
        self.assertEqual(partial_set1.cardHCp(), partial_set2.cardHCp())
        self.assertEqual(partial_class_set1.HCpc(), partial_class_set2.HCpc())
        self.assertEqual(partial_class_set1.cardHCpc(), partial_class_set2.cardHCpc())

if __name__ == '__main__':
    unittest.main()