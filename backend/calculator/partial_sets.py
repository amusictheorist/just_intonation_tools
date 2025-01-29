class PartialSet(set):
    def __init__(self, elements):
        """Initialize a PartialSet, ensuring all elements are positive integers."""
        if not isinstance(elements, (set, list, tuple)):
            raise TypeError('A partial set must be initialized with a set, a list, or a tuple.')
        
        filtered_elements = set(elements)
        if not all(isinstance(x, int) and x > 0 for x in filtered_elements):
            raise ValueError('A partial set can only contain positive integers.')
        
        super().__init__(filtered_elements)

    def __str__(self):
        return '{ ' + ', '.join(str(x) for x in sorted(self.elements)) + ' }'