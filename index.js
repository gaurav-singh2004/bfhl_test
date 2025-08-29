const express = require('express');
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).send("BFHL API with Hardcoded User is running!");
});

app.post('/bfhl', (req, res) => {
    try {
        const full_name = "Gaurav Singh";
        const dob = "24082004"; 
        const email = "gaurav.singh2022@vitstudent.ac.in";
        const roll_number = "22BLC1081";

        const user_id = `${full_name.toLowerCase().replace(/\s+/g, '_')}_${dob}`;

        const { data } = req.body;

        if (!data || !Array.isArray(data)) {
            return res.status(400).json({
                is_success: false,
                error: "The 'data' field is required and must be an array."
            });
        }

        const odd_numbers = [];
        const even_numbers = [];
        const alphabets = [];
        const special_characters = [];
        let sum = 0;
        let alphabet_chars_for_concat = [];

        data.forEach(item => {
            if (!isNaN(item) && !isNaN(parseFloat(item))) {
                const num = parseInt(item, 10);
                sum += num;
                if (num % 2 === 0) {
                    even_numbers.push(item.toString());
                } else {
                    odd_numbers.push(item.toString());
                }
            } else if (typeof item === 'string' && /^[a-zA-Z]+$/.test(item)) {
                alphabets.push(item.toUpperCase());
                for (const char of item) {
                    alphabet_chars_for_concat.push(char);
                }
            } else {
                special_characters.push(item);
            }
        });

        const reversed_chars = alphabet_chars_for_concat.reverse();
        const concat_string = reversed_chars.map((char, index) => {
            return index % 2 === 0 ? char.toUpperCase() : char.toLowerCase();
        }).join('');

        const response = {
            is_success: true,
            user_id: user_id,
            email: email,
            roll_number: roll_number,
            odd_numbers: odd_numbers,
            even_numbers: even_numbers,
            alphabets: alphabets,
            special_characters: special_characters,
            sum: sum.toString(),
            concat_string: concat_string,
        };
        
        return res.status(200).json(response);

    } catch (error) {
        return res.status(500).json({
            is_success: false,
            error: `An internal server error occurred: ${error.message}`
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
