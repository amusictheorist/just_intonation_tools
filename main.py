import math
from functools import reduce

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
    if x <= 0 or y <= 0:
        raise ValueError('Both inputs must be positive integers')
    
    log = math.log(x / y)
    result = log / math.log(2)
    result *= 1200
    return round(result, 2)

def transpose(input_set, n):
    transposed = set()
    for element in input_set:
        transposed.add(element * n)
    return transposed

def parSC_calculator(my_set):
    gdc = reduce(math.gcd, my_set)
    SC = []
    for par in my_set:
        SC.append(int(par / gdc))
    return SC

def parcSC_calculator(my_set):
    filter = set()
    for element in my_set:
        if element % 2 == 0:
            filter.add(par_to_parc(element))
        else:
            filter.add(element)
    gdc = reduce(math.gcd, filter)
    SC = []
    for parc in filter:
        SC.append(int(parc / gdc))
    return SC

def HC_p(input_set):
    sum = 0
    SC = parSC_calculator(input_set)
    for par in SC:
        sum += par
    return sum

def HC_pc(input_set):
    sum = 0
    SC = parcSC_calculator(input_set)
    for parc in SC:
        sum += parc
    return sum

def card_HC_p(input_set):
    card = len(input_set)
    factor = 1/((card*(card+1))/2)
    sum = 0
    SC = parSC_calculator(input_set)
    for par in SC:
        sum += par
    return round((sum * factor), 2)

def card_HC_pc(input_set):
    card = len(input_set)
    factor = 1/(card**2)
    sum = 0
    SC = parcSC_calculator(input_set)
    for parc in SC:
        sum += parc
    return round((sum * factor), 2)

def low_inverse(input_set):
    low_inv = set()
    lcm = reduce(math.lcm, input_set)
    for par in input_set:
        low_inv.add(int(lcm * (1/par)))
    return low_inv

def superset(set1, set2):
    superset = set()
    for par in set1:
        superset.add(par)
    for par in set2:
        superset.add(par)
    return superset

def U_HC_p(set1, set2):
    supset = superset(set1, set2)
    return HC_p(supset)

def U_HC_pc(set1, set2):
    supset = superset(set1, set2)
    return HC_pc(supset)

def card_U_HC_p(set1, set2):
    supset = superset(set1, set2)
    card = len(supset)
    factor = 1/((card*(card+1))/2)
    sum = 0
    SC = parSC_calculator(supset)
    for par in SC:
        sum += par
    return round((sum * factor), 2)

def card_U_HC_pc(set1, set2):
    supset = superset(set1, set2)
    card = len(supset)
    factor = 1/(card**2)
    sum = 0
    SC = parcSC_calculator(supset)
    for parc in SC:
        sum += parc
    return round((sum * factor), 2)