# Test the jalr instruction.
lw 1, 0, a
lw 2, 0, b
addi 3, 1, 0
lw 4, 0, funcaddr
jalr 5, 4
addi 1, 1, 1
addi 2, 2, 1
halt
# A function that adds 2 to the argument in register 3.
func: addi 3, 3, 2 
jalr 0,5 
# Register 1 should have 1 + value at address a.
# Register 2 should have 1 + value at address b.
# Register 3 should have 2 + value at address a.
# Register 4 should have address of instruction at "func".
# Register 5 should have 5.
a: .fill 64
b: .fill 31
funcaddr: .fill func
