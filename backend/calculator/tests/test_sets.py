import unittest
from ..partial_sets import PartialSet

class TestPartialSet(unittest.TestCase):

    def test_initialization_valid(self):
        """Test that a partial set initializes with valid inputs."""
        valid_set = PartialSet([2, 4, 6, 8])
        self.assertEqual(valid_set, {2, 4, 6, 8})