import unittest
from calculator.partial_sets import PartialSet, PartialClassSet, PartialSetClass, PartialClassSetClass

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

    def test_initialization_with_reduction(self):
        """Test that a partial-set class reduces a partial set to its representative form."""
        partial_set = PartialSet({2, 4, 6, 8})
        set_class = PartialSetClass(partial_set)

        self.assertEqual(set_class.representative_set, {1, 2, 3, 4})

    def test_membership(self):
        """Test whether a partial set is correctly recognized as a member of a partial-set class."""
        set_class = PartialSetClass(PartialSet({1, 2, 3, 4}))

        self.assertTrue(set_class.is_member(PartialSet({2, 4, 6, 8})))
        self.assertFalse(set_class.is_member(PartialSet({1, 3, 5, 7})))

    def test_non_membership(self):
        """Test that a set that does not reduce to the representative set is not a member."""
        set_class = PartialSetClass(PartialSet({2, 4, 6, 8}))
        non_member = PartialSet({3, 5, 7, 9})
        self.assertFalse(set_class.is_member(non_member))

    def test_representation(self):
        """Tes that a partial-set class is represented using square brackets."""
        set_class = PartialSetClass(PartialSet({2, 4, 6, 8}))
        self.assertEqual(str(set_class), '[1, 2, 3, 4]')

    def test_equality(self):
        """Test that two partial-set class objects with the same representative set are equal."""
        set1 = PartialSetClass(PartialSet({2, 4, 6, 8}))
        set2 = PartialSetClass(PartialSet({4, 8, 12, 16}))
        self.assertEqual(set1, set2)

    def test_transposition(self):
        """Test that transposing a partial set keeps it in the same partial-set class."""
        set_class = PartialSetClass(PartialSet({2, 4, 6, 8}))
        transposed = PartialSet({4, 8, 12, 16})
        self.assertTrue(set_class.is_member(transposed))

    def test_iteration(self):
        """Test that PartialSetClass can iterate over its members."""
        set_class = PartialSetClass(PartialSet({2, 4, 6, 8}))
        members = list(set_class)
        expected_members = [{2, 4, 6, 8}, {4, 8, 12, 16}, {6, 12, 18, 24}]
        self.assertTrue(all(PartialSet(m) in set_class for m in expected_members))

class TestPartialClassSetClass(unittest.TestCase):

    def test_initialization_invalid(self):
        """Test that a partial-class set class raises an error for invalid inputs."""
        with self.assertRaises(TypeError):
            PartialClassSetClass([1, 2, 3])

        with self.assertRaises(TypeError):
            PartialClassSetClass('invalid')

        with self.assertRaises(TypeError):
            PartialClassSetClass(42)

    def test_initialize_valid(self):
        """Test that a partial-class set class initializes correctly with a partial-class set."""
        partial_class_set = PartialClassSet([1, 3, 5, 7])
        set_class = PartialClassSetClass(partial_class_set)

        self.assertIsInstance(set_class, PartialClassSetClass)
        self.assertEqual(set_class.representative_set, partial_class_set)

    def test_initialization_with_reduction(self):
        """Test that a prtial-class set class reduces a partial-class set to its representative form."""
        partial_class_set = PartialClassSet({3, 9, 15, 21})
        set_class = PartialClassSetClass(partial_class_set)

        self.assertEqual(set_class.representative_set, {1, 3, 5, 7})

    def test_membership(self):
        """Test that a partial-class set is correctly recognized as a member of a partial-class set class."""
        set_class = PartialClassSetClass(PartialClassSet({1, 3, 5, 7}))

        self.assertTrue(set_class.is_member(PartialClassSet({3, 9, 15, 21})))
        self.assertFalse(set_class.is_member(PartialClassSet({3, 5, 7, 9})))

    def test_non_membership(self):
        """Test that a set that does not reduce to the representative set is not a member."""
        set_class = PartialClassSetClass(PartialClassSet({1, 3, 5, 7}))
        non_member = PartialClassSet({3, 5, 7})
        self.assertFalse(set_class.is_member(non_member))

if __name__ == '__main__':
    unittest.main()