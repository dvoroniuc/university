use super::token;
use super::token::Token;
use std::str::Chars;
use std::iter::Peekable;

fn is_letter(ch: char) -> bool {
    ch.is_alphabetic() || ch == '_'
}

pub struct Lexer<'a> {
    input: Peekable<Chars<'a>>,
}

impl<'a> Lexer<'a> {
    pub fn new(input: &str) -> Lexer {
        Lexer {
            input: input.chars().peekable()
        }
    }
    pub fn read_char(&mut self) -> Option<char> {
        self.input.next()
    }
    pub fn pick_char(&mut self) -> Option<&char> {
        self.input.peek()
    }

    pub fn pick_char_eq(&mut self, ch: char) -> bool {
        match self.pick_char() {
            Some(&peek_ch) => peek_ch == ch, None => false,
        }
    }

    fn skip_space(&mut self) {
        while let Some(&c) = self.pick_char() {
            if !c.is_whitespace() {
                break;
            }
            self.read_char();
        }
    }

    fn letter_picked(&mut self) -> bool {
        match self.pick_char() {
            Some(&ch) => is_letter(ch), None => false,
        }
    }

    fn read_id(&mut self, first: char) -> String {
        let mut ident = String::new();
        ident.push(first);

        while self.letter_picked() {
            ident.push(self.read_char().unwrap());
        }
        ident
    }

    fn read_nr(&mut self, first: char) -> i64 {
        let mut number = String::new();
        number.push(first);

        while let Some(&c) = self.pick_char() {
            if !c.is_numeric() {
                break;
            }
            number.push(self.read_char().unwrap());
        }
        let ret_number: i64 = number.parse().unwrap();
        ret_number
    }

    pub fn next_token(&mut self) -> Token {
        self.skip_space();
        match self.read_char() {
            Some('=') => {
                if self.pick_char_eq('=') {
                    self.read_char();Token::Equal
                } else { Token::Assign }
            }
            Some('!') => {
                if self.pick_char_eq('=') {
                    self.read_char();
                    Token::NotEqual
                } else { Token::Exclamation }
            }
            Some('+') => {
                if self.pick_char_eq('+') {
                    self.read_char();Token::Increment
                } else { Token::Plus }
            }
            Some('-') => {
                if self.pick_char_eq('-') {
                    self.read_char();Token::Decrement
                } else { Token::Minus }
            }
            Some('>') => {
                if self.pick_char_eq('=') {
                    self.read_char();Token::MoreThanAndEqual
                } else { Token::MoreThan }
            }
            Some('<') => {
                if self.pick_char_eq('=') {
                    self.read_char();Token::LessThanAndEqual
                } else { Token::LessThan }
            }

            Some('/') => { Token::Slash }
            Some('*') => { Token::Asterisk }
            Some(';') => { Token::Semicolon }
            Some(',') => { Token::Comma }
            Some('(') => { Token::LeftParanthesis }
            Some(')') => { Token::RightParanthesis }
            Some('{') => { Token::LeftBrace }
            Some('}') => { Token::RightBrace }
            Some('[') => { Token::LeftBracket }
            Some(']') => { Token::RightBracket }
            Some(ch @ _) => {
                if is_letter(ch) {
                    let literal = self.read_id(ch);token::get_identifier(&literal)
                } else if ch.is_numeric() {
                    Token::Int(self.read_nr(ch))
                } else {
                    Token::Illegal
                }
            }
            None => Token::Eof
        }
    }

}
