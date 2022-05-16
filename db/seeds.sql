INSERT INTO departments (name)
VALUES ('customer service'), ('accounting'), ('maintenance'), ('human resources');

INSERT INTO roles (title, salary, department_id)
VALUES ('front desk', '15000', 1), ('accountant', '1000', 2), ('manager', '65000', 4);

INSERT INTO employees (first_name, last_name, role_id)
VALUES ('apple', 'jack', 1), ('fruit', 'loop', 2), ('chelsea', 'briggs', 3);