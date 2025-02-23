import unittest
from calculator.utils import find_partitions, count_partitions
from io import StringIO
import sys

class TestUniquePartitions(unittest.TestCase):
    def capture_output(self, func, *args):
        """Helper function to capture output of function."""
        old_stdout = sys.stdout
        sys.stdout = StringIO()
        func(*args)
        output = sys.stdout.getvalue()
        sys.stdout = old_stdout
        return output.strip().split('\n')
    
    def test_find_partition_counts(self):
        """Verify that partition counts are correct."""
        count = [0]
        find_partitions(5, count=count)
        self.assertEqual(count[0], 2)

    def test_find_partitions_output(self):
        """Verify that function output is correctly formatted."""
        output = self.capture_output(find_partitions, 5, 1, None, [0])
        expected_output = ['[1, 4]', '[2, 3]']
        self.assertEqual(output, expected_output)

    def test_count_partitions(self):
        """Verify that output is correctly formatted."""
        output = self.capture_output(count_partitions, 5)
        expected_output = [
            'Distinct partitions of 5:',
            '[1, 4]',
            '[2, 3]',
            'Total partitions: 2'
        ]
        self.assertEqual(output, expected_output)

    def test_edge_case_n1(self):
        """Test that no partitions are found for n=1."""
        count = [0]
        output = self.capture_output(find_partitions, 1, 1, None, count)
        self.assertEqual(count[0], 0)
        self.assertEqual(output, [''])
    
    def test_edge_case_n0(self):
        """Test that no partitions are found for n=0."""
        count = [0]
        output = self.capture_output(find_partitions, 0, 1, None, count)
        self.assertEqual(count[0], 0)
        self.assertEqual(output, [''])

    def test_large_n(self):
        """test that a large value for n is handled correctly."""
        count = [0]
        find_partitions(100, count=count)
        self.assertEqual(count[0], 444792)

    def test_mutable_default_does_not_persist(self):
        """Ensure count does not persist across multiple calls."""
        count_partitions(5)
        output = self.capture_output(count_partitions, 4)
        self.assertTrue(output[-1].endswith('Total partitions: 1'))

if __name__ == '__main__':
    unittest.main()