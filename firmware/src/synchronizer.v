module synchronizer
(
    input   in_clk,     // Source clock
    input   out_clk,    // Destination clock
    input   in,         // Input data
    output  out         // Output synchronized data
);

//reg       buffer;
reg [1:0] sync;

assign out = sync[1];

//always @(posedge in_clk)
//    buffer <= in;

always @(posedge out_clk)
//    sync <= {sync[0], buffer};
    sync <= {sync[0], in};

endmodule

