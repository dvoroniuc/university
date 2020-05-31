mod embded_lexer;
mod embded_parser;
use embded_lexer::lexer::Lexer;
use embded_lexer::tokenization::Token;
use embded_parser::parse_item::Program;
use embded_parser::parser::Parser;
use std::fs::File;
use std::io::{BufRead, BufReader};

fn main() {
    let file = File::open("input.txt").unwrap();
    let reader = BufReader::new(file);
    for val in reader.lines() {
        let mut line = val.unwrap();
        let mut lexer = Lexer::new(&mut line);
        let mut parser = Parser::new(lexer);
        let program = parser.parse();
        let errors = parser.get_errors();
        for listing_el in &program { println!("{}", listing_el); }

        if errors.len() == 0 {
            println!("result of the parsed code:");
        } else {
            for listing_el in &errors { println!("{}", listing_el); }
        }
    }
}
