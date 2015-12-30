            lw 1, 4, mplier     # put multiplier in reg 1 (for shifting)
            lw 2, 0, mask       # put mask in reg 2
            lw 3, 0, mcand      # put multiplicand in reg 3 (for comparison for loop)
            addi 5, 0, 0        # Initialize the product to 0.
loop:       lw 4, 0, mplier     # put multiplier in reg 4 for checking current bit.
            nand 4, 2, 4        # check bit in multiplicand for 1 or 0. First, NAND it with mask.
            nand 4, 4, 4        # Then invert result.
            bne 2, 4, noadd     # If the result is not equal to the mask, it's 0, so skip the accum step.
            nop
            nop
            add 5, 5, 3         # Add the shifted multiplicand to the accum.
noadd:      add 3, 3, 3         # Shift the multiplicand by one bit.
            add 2, 2, 2         # Shift the mask by one bit.
            nand 4, 2, 2        # Subtract the current mask from the multiplier. First invert the mask.
            addi 4, 4, 1        # Add 1 to result to negate it.
            add 4, 4, 1         # Perform the subtraction.
            lw 6, 0, negmask    # Get the mask to check for < 0.
            nand 7, 4, 6        # Check to see if result of subtraction was less than 0. First NAND with negmask.
            nand 6, 6, 6        # Then invert the mask for comparison. We will compare against 0x7fff.
            bne 7, 6, loop      # If reg 7==0x7fff, then we're done. If not, go back to loop with next bit in multiplicand.
            nop
            nop
            halt                # Result is in register 5.
mcand:      .fill 0xe6
mplier:     .fill 0x9
mask:       .fill 0x1
negmask:    .fill 0x8000
