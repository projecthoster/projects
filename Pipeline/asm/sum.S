            lw 1,0,spaddr   # stack pointer in reg 1
            lw 2,0,n        # Get number of elements
            addi 2,2,-1     # decrement arg
            lw 7,0,sumaddr  # put addr of routine in reg 7
            jalr 3,7
            halt
sum:        addi 4,2,1 
            bne 4,0,cont    # arg in reg 2. If zero, return.
            jalr 0,3        # return addr in reg 3
cont:       sw 2,1,0        # save arg on stack
            sw 3,1,1        # save ret addr on stack
            addi 1,1,2      # adjust stack pointer
            addi 2,2,-1     # decrement arg
            jalr 3,7        # call routine
            lw 3,1,-1       # restore previous ret val from stack
            lw 2,1,-2       # restore previous arg from stack
            addi 1,1,-2     # restore previous stack ptr
            lw 5,0,aaddr    # get starting addr of array
            add 5,5,2       # get addr of argth element of array
            lw 5,5,0        # get argth element of array
            add 6,5,6       # accumulate. ret value in reg 6
            jalr 0,3        # return from routine
n:          .fill 6 
sumaddr:    .fill sum
aaddr:      .fill a
a:          .fill 0x4
            .fill 16526
            .fill -60
            .fill 10
            .fill 0x124
            .fill 77
spaddr:     .fill sp
sp:         .fill 0
