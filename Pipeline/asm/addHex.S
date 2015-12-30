# Test the add instruction with a negative
# value given in hex.
lw 1, 0, a
lw 2, 0, b
add 3,2,1
halt 
# Register 1 should have value at address a.
# Register 2 should have value at address b.
# Register 3 should have sum of those values.
a: .fill 64
b: .fill 0x8000
