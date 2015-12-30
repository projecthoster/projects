# Test the add instruction.
lw 1, 0, a
lw 2, 0, b
add 3, 2, 1
halt 
# Register 1 should have the value at address a.
# Register 2 should have the value at address b.
# Register 3 should have the sum of these values.
a: .fill 64
b: .fill 31
