use crate::embded_lexer::tokenization::Token;
pub type Identifier = String;
use std::fmt;

pub struct Program { pub statements: Vec<Statement>, }

impl Program {
    pub fn new() -> Program {
        Program {
            statements: Vec::new(),
        }
    }
}

#[derive(Debug, Clone, PartialEq)]
pub enum Statement {
    Let(Identifier, Expression),
    Expression(Expression),
    None,
}
impl fmt::Display for Statement {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match self {
            Statement::Expression(expr) => write!(f, "{}", expr),
            _ => writeln!(f, "{:?}", self),
        }
    }
}

#[derive(Debug, Clone, PartialEq)]
pub enum Expression {
    Bool(bool),
    Identifier(Identifier),
    Integer(i64),
    Call {
        func: Box<Expression>,
        args: Vec<Expression>,
    },
    Function(Identifier, Vec<Identifier>, Vec<Statement>),
    Infix(Infix, Box<Expression>, Box<Expression>),
    Prefix(Prefix, Box<Expression>),
    Index(Box<Expression>, Box<Expression>),
}

impl fmt::Display for Expression {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match self {
            Expression::Function(ident, pars, stmts) => {
                write!(f, "\nFunction: {}\n", ident)?;
                write!(f, "\tParameters:\n\t\t")?;
                for st in pars {
                    write!(f, "{} ", st)?;
                }
                write!(f, "\n\tStatements: ")?;
                for st in stmts {
                    write!(f, "\n\t\t{} ", st)?;
                }
                writeln!(f, "")
            }
            Expression::Index(ident, expr) => {
                write!(f, "{}", *ident)?;
                write!(f, "[{}]", *expr)
            }
            Expression::Infix(inf, expr1, expr2) => {
                write!(f, "\n\t\t\t{} {} {}", *expr1, inf, *expr2)
            }
            _ => write!(f, "{:?}", self),
        }
    }
}

#[derive(Debug, Clone, PartialEq)]
pub enum Infix {
    Plus,
    Minus,
    Divide,
    Multiply,
    Equal,
    NotEqual,
    MoreThanAndEqual,
    MoreThan,
    LessThanAndEqual,
    LessThan,
    Assign,
}

impl fmt::Display for Infix {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match *self {
            Infix::Plus => write!(f, "+"),
            Infix::Minus => write!(f, "-"),
            Infix::Divide => write!(f, "/"),
            Infix::Multiply => write!(f, "*"),
            Infix::Equal => write!(f, "=="),
            Infix::NotEqual => write!(f, "!="),
            Infix::MoreThanAndEqual => write!(f, ">="),
            Infix::MoreThan => write!(f, ">"),
            Infix::LessThanAndEqual => write!(f, "<="),
            Infix::LessThan => write!(f, "<"),
            Infix::Assign => write!(f, "="),
        }
    }
}

#[derive(Debug, Clone, PartialEq)]
pub enum Prefix {
    Plus,
    Minus,
    Not,
}

impl fmt::Display for Prefix {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match *self {
            Prefix::Plus => write!(f, "++"),
            Prefix::Minus => write!(f, "--"),
            Prefix::Not => write!(f, "!"),
        }
    }
}
