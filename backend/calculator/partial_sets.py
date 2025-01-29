class PartialSet(set):
    def __init__(self, elements):
        """Initialize a partial set, ensuring all elements are positive integers."""
        if not isinstance(elements, (set, list, tuple, range)):
            raise TypeError('A partial set must be initialized with a set, a list, a tuple, or a range.')

        filtered_elements = set(elements)
        if not filtered_elements:
            raise ValueError('A partial set cannot be empty.')
        
        if not all(isinstance(x, int) and x > 0 for x in filtered_elements):
            raise ValueError('A partial set can only contain positive integers.')
        
        super().__init__(filtered_elements)

    def __str__(self):
        return '{ ' + ', '.join(str(x) for x in sorted(self)) + ' }'
    
class PartialClassSet(set):
    def __init__(self, elements):
        """Initialize a partial-class set, ensuring all elements are odd positive integers."""
        if not isinstance(elements, (set, list, tuple, range)):
            raise TypeError('A partial-class set must be initialized with a set, a list, a tuple, or a range.')
        
        filtered_elements = set(elements)
        if not filtered_elements:
            raise ValueError('A partial-class set cannot be empty.')
        
        if not all(isinstance(x, int) and x > 0 and x % 2 == 1 for x in filtered_elements):
            raise ValueError('All elements must be odd positive integers.')
        
        super().__init__(filtered_elements)

    def __str__(self):
        return '{' + ', '.join(f"_{e}_" for e in sorted(self)) + '}'
    
class PartialSetClass:
    def __init__(self, partial_set):
        """Initialize a partial-set class with a PartialSet."""
        if not isinstance(partial_set, PartialSet):
            raise TypeError('A partial-set class must be initialized with a partial set.')
        self.representative_set = partial_set

    