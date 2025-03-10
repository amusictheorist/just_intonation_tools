import math
from collections import namedtuple
from functools import reduce
from .partial_sets import PartialClassSet

ErrorMessages = namedtuple('ErrorMessages', [
    'invalid_positive_integer',
    'invalid_two_positive_integers',
    'invalid_set_integers',
    'empty_set',
    'invalid_set',
    'invalid_inversion'
])

ERROR_MESSAGES = ErrorMessages(
    invalid_positive_integer='Invalid input, please enter a positive integer',
    invalid_two_positive_integers='Invalid input, both inputs must be positive integers',
    invalid_set_integers='Invalid input, please enter only positive integers',
    empty_set='Invalid input, set cannot be empty',
    invalid_set='Invalid input, please enter a valid set',
    invalid_inversion='Low inverse is undefined for single-element sets'
)

def par_to_parc(partial_set):
    if not isinstance(partial_set, (set, list, tuple, range)):
        raise TypeError('Partial to partial-class conversion requires a set, list, tuple, or range of partials.')
    
    def _reduce_to_parc(num):
        while num % 2 == 0:
            num //= 2
        return num
    
    partial_class_set = {_reduce_to_parc(e) for e in partial_set}
    return PartialClassSet(partial_class_set)
    

def ratio_to_cents(x, y):
    if not isinstance(x, int) or not isinstance(y, int):
        raise ValueError(ERROR_MESSAGES.invalid_two_positive_integers)

    if x <= 0 or y <= 0:
        raise ValueError(ERROR_MESSAGES.invalid_two_positive_integers)

    log = math.log(x/y)
    result = log / math.log(2)
    result *= 1200
    return round(result, 2)

def check_set_integers(input_set):
    return all(isinstance(i, int) for i in input_set)

def create_set():
    user_input = input('Enter integers separated by spaces: ')
    if not user_input.strip():
        return ERROR_MESSAGES.empty_set

    try:
        nums = {int(num) for num in user_input.split()}
        if not check_set_integers(nums) or any(num < 0 for num in nums):
            return ERROR_MESSAGES.invalid_set_integers
        return nums
    except ValueError:
        return ERROR_MESSAGES.invalid_set_integers
    
def transpose(input_set, n):
    if not isinstance(input_set, set):
        raise TypeError(ERROR_MESSAGES.invalid_set)
    if not isinstance(n, int) or n <= 0:
        raise ValueError(ERROR_MESSAGES.invalid_set_integers)
    if not input_set:
        raise ValueError(ERROR_MESSAGES.empty_set)
    if not check_set_integers(input_set):
        raise ValueError(ERROR_MESSAGES.invalid_set_integers)
    if 0 in input_set:
        raise ValueError(ERROR_MESSAGES.invalid_set_integers)
    
    transposed = {i * n for i in input_set}
    return transposed

def low_inverse(input_set):
    if not isinstance(input_set, set):
        raise TypeError(ERROR_MESSAGES.invalid_set)
    if not check_set_integers(input_set):
        raise ValueError(ERROR_MESSAGES.invalid_set_integers)
    if not input_set:
        raise ValueError(ERROR_MESSAGES.empty_set)
    if len(input_set) == 1:
        return input_set
    
    low_inv = set()
    lcm = reduce(math.lcm, input_set)
    for par in input_set:
        low_inv.add(int(lcm * (1/par)))
    return low_inv

def find_partitions(n, start=1, path=None, count=[0]):
    if path is None:
        path = []

    if n == 0:
        if len(path) > 1:
            count[0] += 1
            print(path)
        return
    
    for i in range(start, n + 1):
        find_partitions(n - i, i + 1, path + [i], count)

def count_partitions(n):
    print(f"Distinct partitions of {n}:")
    count = [0]
    find_partitions(n, count=count)
    print(f"Total partitions: {count[0]}")