INSERT INTO pgpw_test.table_one (id, data)
  VALUES
    ('5db1e0ba-6342-463f-bdbb-ebb4b9551e54', 'foo'),
    ('0ce04190-ca8f-4cfd-a167-f4906d56942a', 'bar');

INSERT INTO pgpw_test.table_two (id, one_id, data)
  VALUES
    ('e94d561a-18a3-4bb5-97f6-0537a1296c39', '5db1e0ba-6342-463f-bdbb-ebb4b9551e54', 'baz'),
    ('307a0dcc-6097-43be-adef-f69a749cd818', '5db1e0ba-6342-463f-bdbb-ebb4b9551e54', 'poo'),
    ('d0569e56-8753-488c-92ab-23418f64b844', '0ce04190-ca8f-4cfd-a167-f4906d56942a', 'paz');
