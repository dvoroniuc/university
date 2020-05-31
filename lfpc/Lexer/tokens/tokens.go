package tokens

type TokenType string

const (
	NEMO = "NEMO"
	EOF  = "EOF"

	IDENTIFS = "IDENT"
	INT      = "INT"

	// Operators
	EQUAL  = "="
	PLUS   = "+"
	DIVIDE = "/"
	MULT   = "*"
	MINUS  = "-"
	BIGGER = ">"
	LESS   = "<"

	// Delimiters
	COMMA     = ","
	SEMICOLON = ";"

	LPAR   = "("
	RPAR   = ")"
	LBRACK = "["
	RBRACK = "]"

	// Keywords
	FUN    = "FUNCTION"
	LET    = "LET"
	IF     = "IF"
	ELSE   = "ELSE"
	TRUE   = "TRUE"
	FALSE  = "FALSE"
	RETURN = "RETURN"
	NOT    = "NOT"
)

type Token struct {
	Type  TokenType
	Input string
}

var keywords = map[string]TokenType{
	"function": FUN,
	"let":      LET,
	"if":       IF,
	"else":     ELSE,
	"true":     TRUE,
	"false":    FALSE,
	"return":   RETURN,
	"not":      NOT,
}

func LookupIdent(ident string) TokenType {
	if tok, ok := keywords[ident]; ok {
		return tok
	}
	return IDENTIFS
}
