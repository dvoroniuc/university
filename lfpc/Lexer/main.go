package main

import (
	"fmt"
	"go/reader"
	"os"
)

func main() {
	fmt.Printf("Type in commands\n")
	reader.Start(os.Stdin, os.Stdout)
}
