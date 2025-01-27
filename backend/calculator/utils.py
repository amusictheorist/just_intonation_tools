def par_to_parc(num):
    if type(num) is not int:
        return 'Invalid input, please enter a positive integer'

    if num <= 0:
        return 'Invalid input, please enter a positive integer'

    if num % 2 != 0:
        return num

    else:
        num //= 2
        return par_to_parc(num)
    
def ratio_to_cents(x, y):
    pass