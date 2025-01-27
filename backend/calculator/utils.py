import math
error_message = 'Invalid input, please enter a positive integer'
value_error = 'Invalid input, both inputs must be positive integers'
set_error = 'Invalid input, please enter only positive integers'

def par_to_parc(num):
    if type(num) is not int:
        return error_message

    if num <= 0:
        return error_message

    if num % 2 != 0:
        return num

    else:
        num //= 2
        return par_to_parc(num)
    
def ratio_to_cents(x, y):
    if not isinstance(x, int) or not isinstance(y, int):
        raise ValueError(value_error)
    
    if x <= 0 or y <= 0:
        raise ValueError(value_error)
    
    log = math.log(x/y)
    result = log / math.log(2)
    result *= 1200
    return round(result, 2)

def create_set():
    user_input = input('Enter integers separated by spaces: ')
    try:
        nums = [int(num) for num in user_input.split()]
        return sorted(set(nums))
    except ValueError:
        return set_error