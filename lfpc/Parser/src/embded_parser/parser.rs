use std::fmt;
use std::mem;
use super::parse_item;
use crate::embded_lexer::lexer::Lexer;
use crate::embded_lexer::tokenization::Token;
pub type ParseErrors = Vec<ParseError>;
pub type Program = Vec<parse_item::Statement>;

#[derive(Debug, Clone, PartialEq, PartialOrd)]
pub enum Precedence {
    Lowest, Equals, LessGreater,
    Sum, Product, Prefix,
    Call, Index, Assign,
}

#[derive(Debug, Clone)]
pub enum Error { UnexpectedToken, }

impl fmt::Display for Error {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match *self {
            Error::UnexpectedToken => write!(f, "Unexpected Token!"),
        }
    }
}

#[derive(Debug, Clone)]
pub struct ParseError {
    kind: Error,
    msg: String,
}

impl ParseError {
    fn new(kind: Error, msg: String) -> Self {
        ParseError { kind, msg }
    }
}

impl fmt::Display for ParseError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "{}: {}", self.kind, self.msg)
    }
}

pub struct Parser<'a> {
    pub current_token: Box<Token>,
    pub next_token: Box<Token>,
    lexer: Lexer<'a>,
    err_list: ParseErrors,
}

impl<'a> Parser<'a> {
    pub fn new(lexer_: Lexer<'a>) -> Parser<'a> {
        let mut parser = Parser {
            lexer: lexer_,
            current_token: Box::new(Token::Illegal),
            next_token: Box::new(Token::Illegal),
            err_list: Vec::new(),
        };
        parser.next_token();
        parser.next_token();

        parser
    }

    pub fn get_errors(&mut self) -> ParseErrors {
        self.err_list.clone()
    }

    fn err_next(&mut self, tok: &Token) {
        self.err_list.push(ParseError::new(
            Error::UnexpectedToken,
            format!("expected {}, but found {} instead", *tok, *self.next_token),
        ));
    }

    fn err_no_prefix(&mut self) {
        self.err_list.push(ParseError::new(
            Error::UnexpectedToken,
            format!("no prefix for {:?} found", *self.current_token,),
        ));
    }

    pub fn next_token(&mut self) {
        self.current_token = mem::replace(&mut self.next_token, Box::new(self.lexer.next_token()));
    }

    fn next_token_is(&self, tok: &Token) -> bool {
        *self.next_token == *tok
    }

    fn if_next_token(&mut self, token: Token) -> bool {
        if self.next_token_is(&token) {
            self.next_token();
            true
        } else {
            self.err_next(&token);
            false
        }
    }

    fn token_order(token: &Token) -> Precedence {
        match token {
            Token::Equal | Token::NotEqual => Precedence::Equals,
            Token::LessThan | Token::LessThanAndEqual | Token::MoreThan | Token::MoreThanAndEqual => Precedence::LessGreater,
            Token::Plus | Token::Minus => Precedence::Sum,
            Token::Asterisk | Token::Slash => Precedence::Product,
            Token::LeftBracket => Precedence::Index,
            Token::LeftParanthesis => Precedence::Call,
            Token::Assign => Precedence::Assign,
            _ => Precedence::Lowest,
        }
    }

    fn pick_order(&self) -> Precedence {
        Self::token_order(&self.next_token)
    }

    fn curr_order(&self) -> Precedence {
        Self::token_order(&self.current_token)
    }

    pub fn parse(&mut self) -> Program {
        let mut program: Program = vec![];

        while *self.current_token != Token::Eof {
            match self.parse_by_stmnt() {
                Some(stmt) => program.push(stmt),
                None => {}
            }
            self.next_token();
        }
        program
    }

    fn parse_by_id(&mut self) -> Option<String> {
        match *self.current_token {
            Token::Identifier(ref mut ident) => Some(ident.to_string()),
            _ => None,
        }
    }

    fn parse_by_stmnt(&mut self) -> Option<parse_item::Statement> {
        match (*self.current_token) {
            Token::Let => self.parse_let(),
            Token::Illegal => Some(parse_item::Statement::None),
            _ => self.parse_by_stmnt_expression(),
        }
    }

    fn parse_by_stmnt_expression(&mut self) -> Option<parse_item::Statement> {
        match self.parse_expression(Precedence::Lowest) {
            Some(expr) => Some(parse_item::Statement::Expression(expr)),
            None => None,
        }
    }

    fn parse_expression(&mut self, order: Precedence) -> Option<parse_item::Expression> {
        let mut left = match *self.current_token {
            Token::Identifier(_) => self.parse_by_id_expression(),
            Token::True | Token::False => self.parse_bool(),
            Token::Int(_) => self.parse_int(),
            Token::Fn => self.parse_function(),
            Token::Exclamation | Token::Minus | Token::Plus => self.parse_prefix_expression(),
            Token::Semicolon => {
                self.next_token();
                return None;
            }
            _ => {
                self.err_no_prefix();
                return None;
            }
        };

        while !self.next_token_is(&Token::Semicolon) && order < self.pick_order() {
            match *self.next_token {
                Token::Plus | Token::Minus | Token::Slash | Token::Asterisk | Token::Equal | Token::NotEqual
                | Token::LessThan | Token::LessThanAndEqual | Token::MoreThan | Token::MoreThanAndEqual
                | Token::Assign => {
                    self.next_token();
                    left = self.parse_infix_expression(left.unwrap());
                }
                Token::Identifier(_) => {
                    self.next_token();
                    self.err_no_prefix();
                }
                Token::LeftBracket => {
                    self.next_token();
                    left = self.parse_index_expression(left.unwrap());
                }
                Token::LeftParanthesis => {
                    self.next_token();
                    left = self.parse_call(left.unwrap());
                }
                _ => return left,
            }
        }

        if *self.next_token == Token::Eof
            && *self.current_token != Token::Eof
            && *self.current_token != Token::Semicolon
            && *self.current_token != Token::RightBrace
        {
            self.err_next(&Token::Semicolon);
            self.next_token();
            return None;
        }
        left
    }

    fn parse_prefix_expression(&mut self) -> Option<parse_item::Expression> {
        let prefix = match *self.current_token {
            Token::Plus => parse_item::Prefix::Plus,
            Token::Minus => parse_item::Prefix::Minus,
            Token::Exclamation => parse_item::Prefix::Not,
            _ => {
                self.err_no_prefix();
                return None;
            }
        };

        self.next_token();

        match self.parse_expression(Precedence::Prefix) {
            Some(expr) => Some(parse_item::Expression::Prefix(prefix, Box::new(expr))),
            None => None,
        }
    }

    fn parse_infix_expression(
        &mut self,
        left: parse_item::Expression,
    ) -> Option<parse_item::Expression> {
        let infix = match *self.current_token {
            Token::Plus => parse_item::Infix::Plus,
            Token::Minus => parse_item::Infix::Minus,
            Token::Asterisk => parse_item::Infix::Multiply,
            Token::Slash => parse_item::Infix::Divide,
            Token::Equal => parse_item::Infix::Equal,
            Token::NotEqual => parse_item::Infix::NotEqual,
            Token::LessThanAndEqual => parse_item::Infix::LessThanAndEqual,
            Token::LessThan => parse_item::Infix::LessThan,
            Token::MoreThanAndEqual => parse_item::Infix::MoreThanAndEqual,
            Token::MoreThan => parse_item::Infix::MoreThan,
            Token::Assign => parse_item::Infix::Assign,
            _ => return None,
        };

        let order = self.curr_order();

        self.next_token();

        match self.parse_expression(order) {
            Some(expression) => {
                //self.next_token();
                Some(parse_item::Expression::Infix(
                    infix,
                    Box::new(left),
                    Box::new(expression),
                ))
            }
            None => None,
        }
    }

    fn parse_index_expression(
        &mut self,
        left: parse_item::Expression,
    ) -> Option<parse_item::Expression> {
        self.next_token();
        let index = match self.parse_expression(Precedence::Lowest) {
            Some(expr) => expr,
            None => return None,
        };

        if !self.if_next_token(Token::RightBracket) {
            return None;
        }

        Some(parse_item::Expression::Index(
            Box::new(left),
            Box::new(index),
        ))
    }

    fn parse_by_id_expression(&mut self) -> Option<parse_item::Expression> {
        match self.parse_by_id() {
            Some(ident) => Some(parse_item::Expression::Identifier(ident)),
            _ => return None,
        }
    }

    fn parse_bool(&mut self) -> Option<parse_item::Expression> {
        match *self.current_token {
            Token::True => Some(parse_item::Expression::Bool(true)),
            Token::False => Some(parse_item::Expression::Bool(false)),
            _ => None,
        }
    }

    fn parse_int(&mut self) -> Option<parse_item::Expression> {
        match *self.current_token {
            Token::Int(ref mut int) => Some(parse_item::Expression::Integer(*int)),
            _ => None,
        }
    }

    fn parse_list(&mut self, end: Token) -> Option<Vec<parse_item::Expression>> {
        let mut vec = vec![];

        if self.next_token_is(&end) {
            self.next_token();
            return Some(vec);
        }

        self.next_token();

        match self.parse_expression(Precedence::Lowest) {
            Some(expr) => vec.push(expr),
            _ => return None,
        }

        while self.next_token_is(&Token::Comma) {
            self.next_token();
            self.next_token();

            match self.parse_expression(Precedence::Lowest) {
                Some(expr) => vec.push(expr),
                _ => return None,
            }
        }

        if !self.if_next_token(end) { return None; }
        Some(vec)
    }

    fn parse_function_parameters(&mut self) -> Option<Vec<String>> {
        let mut params = vec![];

        if self.if_next_token(Token::RightParanthesis) { return Some(params); }

        self.next_token();

        match self.parse_by_id() {
            Some(ident) => params.push(ident),
            _ => return None,
        };

        while self.next_token_is(&Token::Comma) {
            self.next_token();
            self.next_token();

            match self.parse_by_id() {
                Some(ident) => params.push(ident),
                _ => return None,
            };
        }

        if !self.if_next_token(Token::RightParanthesis) {
            self.err_next(&Token::RightParanthesis);
            return None;
        }

        Some(params)
    }

    fn parse_function(&mut self) -> Option<parse_item::Expression> {
        self.next_token();
        if *self.current_token == Token::LeftParanthesis {
            self.err_next(&Token::LeftParanthesis);
            return None;
        }

        let ident = match self.parse_by_id() {
            Some(ident) => ident,
            _ => return None,
        };
        self.next_token();

        let params = match self.parse_function_parameters() {
            Some(params) => params,
            _ => return None,
        };

        if !self.if_next_token(Token::LeftBrace) {
            self.err_next(&Token::LeftBrace);
            return None;
        }

        let body = self.parse_block();

        self.next_token();

        Some(parse_item::Expression::Function(ident, params, body))
    }

    fn parse_block(&mut self) -> Vec<parse_item::Statement> {
        let mut statements: Vec<parse_item::Statement> = vec![];

        self.next_token();

        while *self.current_token != Token::RightBrace && *self.current_token != Token::Eof {
            match self.parse_by_stmnt() {
                Some(statement) => {
                    if *self.next_token != Token::Semicolon {
                        self.err_next(&Token::Semicolon);
                        *self.current_token = Token::Eof;
                        *self.next_token = Token::Eof;
                        self.next_token();
                        ()
                    }

                    statements.push(statement);
                    self.next_token();
                }
                None => (),
            }
            self.next_token();
        }

        statements
    }

    pub fn parse_let(&mut self) -> Option<parse_item::Statement> {
        match *self.next_token {
            Token::Identifier(_) => self.next_token(),
            _ => return None,
        }

        let ident = match self.parse_by_id() {
            Some(name) => name,
            None => return None,
        };

        if *self.next_token == Token::Semicolon {
            return Some(parse_item::Statement::Let(
                ident,
                parse_item::Expression::Integer(0),
            ));
        }

        if !self.if_next_token(Token::Assign) {
            self.next_token();
            return None;
        }

        self.next_token();
        let eval = match self.parse_expression(Precedence::Lowest) {
            Some(expr) => expr,
            _ => return None,
        };

        Some(parse_item::Statement::Let(ident, eval))
    }

    pub fn parse_call(
        &mut self,
        expr: parse_item::Expression,
    ) -> Option<parse_item::Expression> {
        let args = match self.parse_list(Token::RightParanthesis) {
            Some(args) => args,
            None => return None,
        };

        Some(parse_item::Expression::Call {
            func: Box::new(expr),
            args,
        })
    }
}


