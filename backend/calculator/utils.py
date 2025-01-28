import math
from collections import namedtuple

ErrorMessages = namedtuple('ErrorMessages', [
    'invalid_positive_integer',
    'invalid_two_positive_integers',
    'invalid_set_integers',
    'empty_set',
    'invalid_set'
])

ERROR_MESSAGES = ErrorMessages(
    invalid_positive_integer='Invalid input, please enter a positive integer',
    invalid_two_positive_integers='Invalid input, both inputs must be positive integers',
    invalid_set_integers='Invalid input, please enter only positive integers',
    empty_set='Invalid input, set cannot be empty',
    invalid_set='Invalid input, please enter a valid set'
)

def par_to_parc(num):
    if not isinstance(num, int):
      raise ValueError(ERROR_MESSAGES.invalid_positive_integer)

    if num <= 0:
        raise ValueError(ERROR_MESSAGES.invalid_positive_integer)

    if num % 2 != 0:
        return num

    else:
        num //= 2
    return par_to_parc(num)

def ratio_to_cents(x, y):
    if not isinstance(x, int) or not isinstance(y, int):
        raise ValueError(ERROR_MESSAGES.invalid_two_positive_integers)

    if x <= 0 or y <= 0:
        raise ValueError(ERROR_MESSAGES.invalid_two_positive_integers)

    log = math.log(x/y)
    result = log / math.log(2)
    result *= 1200
    return round(result, 2)

def create_set():
    user_input = input('Enter integers separated by spaces: ')
    if not user_input.strip():
        return ERROR_MESSAGES.empty_set

    try:
        nums = {int(num) for num in user_input.split()}
        if any(num < 0 for num in nums):
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
    try:
        input_set = {int(i) for i in input_set}
    except ValueError:
        raise ValueError(ERROR_MESSAGES.invalid_set_integers)
    if 0 in input_set:
        raise ValueError(ERROR_MESSAGES.invalid_set_integers)
    
    transposed = {i * n for i in input_set}
    return transposed

def parSC(input_set):
    if not isinstance(input_set, set):
        raise TypeError(ERROR_MESSAGES.invalid_set)