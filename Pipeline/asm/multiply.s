#
# CS441 - multiply.s
#

		add 1,0,0			# Clear out reg1
		lw 2,0,mcand 		# load reg2 with mcand 
		lw 3,0,mplier		# load reg3 with mplier 
		lw 4,0,endPos		# load reg4 with endPos
		addi 5,0,1			# initialize pos to 1

start:	nand 6,3,5			# Mask off the pos(th) bit
		nand 6,6,6			# invert the result
		nand 6,6,5			# store the check into reg7	
		nand 6,6,6			# inver that result
		bne 6,5,sLeft		# If check is greater than 1, add mcand to reg1
		add 1,1,2			# Add mcand to reg1  
sLeft: 	add 2,2,2			# Shift mcand to the left by 1 by adding it to itself
		add 5,5,5			# Shift pos left by 1
		bne 5,4,start		# Back to start if repititions equal mplier
	 	halt 				 
		nop 

mcand: 	.fill 5
mplier: .fill 5
endPos: .fill 0x80			# We can assume the numbers wont be larger than 7 digits

