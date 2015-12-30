# Test the sw instruction.
addi 2, 0, w
addi 1, 0, 62
sw 1, 2, 0
sw 1, 2, 1
addi 3, 1, 62
addi 4, 0, y
sw 3, 4, 0
sw 3, 4, 2
halt 
# Register 1 should have 62.
# Register 2 should have 9.
# Register 3 should have 124.
# Register 4 should have 11.
# Addresses 0x9 and 0xa should have 62.
# Address 0xb and 0xd should have 124.
# Address 0xc should have 32767.
w: .fill 0
x: .fill 1
y: .fill 2
z: .fill 32767
u: .fill 3
