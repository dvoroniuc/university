package com.company.ex4;
import java.util.*;
import java.nio.charset.StandardCharsets;
import java.nio.file.*;
import java.io.*;

import static com.company.ex4.Verify.verifyExpression;

public class Main {

    public static List<String> readFileInList(String fileName)
    {
        List<String> lines = Collections.emptyList();
        try { lines = Files.readAllLines(Paths.get(fileName), StandardCharsets.UTF_8); }

        catch (IOException e) {            e.printStackTrace(); }
        return lines;
    }

    public static void main(String[] args) {

        List<String> l = readFileInList("C:\\My Files\\expression.txt");

        for(String obj : l) {
            System.out.print(obj+" - ");
            //Converting to char
            char[] exp=obj.toCharArray();
            //Verifying the expression and show result
            if (verifyExpression(exp))
                System.out.println("Correct expression!");
            else
                System.out.println("Wrong expression!");

        }
    }
}
