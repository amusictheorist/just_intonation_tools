class PartialSet(set):
    def __init__(self, elements):
        """Initialize a partial set, ensuring all elements are positive integers."""
        if not isinstance(elements, (set, list, tuple)):
            raise TypeError('A partial set must be initialized with a set, a list, or a tuple.')

        filtered_elements = set(elements)
        if not all(isinstance(x, int) and x > 0 for x in filtered_elements):
            raise ValueError('A partial set can only contain positive integers.')
        
        super().__init__(filtered_elements)

    def __str__(self):
        return '{ ' + ', '.join(str(x) for x in sorted(self)) + ' }'


    
class PartialClassSet(set):
    def __init__(self, elements):
        """Initialize a partial-class set, ensuring all elements are odd positive integers."""
        if not all(isinstance(e, int) and e > 0 and e % 2 == 0 for e in elements):
            raise ValueError('All elements must be odd positive integers.')
        if not isinstance(elements, (set, list, tuple)):
            raise TypeError('A partial-class set must be initialized with a set, a list, or a tuple.')
        self.elements = set(elements)

    def __str__(self):
        return '{ ' + ', '.join(f"_{e}_" for e in sorted(self.elements)) + ' }'

    def _reduce_to_parc(self, num):
        while num % 2 == 0:
            num //= 2
        return num
    
    def par_to_parc(self):
        self.elements = {self._reduce_to_parc(e) for e in self.elements}