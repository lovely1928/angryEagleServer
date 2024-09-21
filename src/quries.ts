let q1 = `# Write your MySQL query statement below
SELECT a1.machine_id as machine_id, ROUND(AVG(a2.timestamp-a1.timeStamp),3) as processing_time
FROM Activity a1
JOIN Activity a2
ON a1.machine_id = a2.machine_id AND a1.process_id= a2.process_id AND a1.activity_type = 'start' AND a2.activity_type = 'end'
GROUP BY a1.machine_id`

let q1934 = `# Write your MySQL query statement below
    SELECT (COUNT(s.user_id) WHERE c.action = 'confirmed')AS confirmedCount,
            (COUNT(s.user_id) WHERE c.action = 'timeout')AS timeOutCount,
    FROM Signups s
    JOIN Confirmations c
    ON s.user_id = c.user_id AND s.time_stamp = c.time_stamp
    GROUP BY s.user_id`

//     # Write your MySQL query statement below
// SELECT 
//    ROUND( (SUM(CASE 
//         WHEN order_date = customer_pref_delivery_date 
//         THEN 1 
//         ELSE 0 
//     END) / COUNT(*)*100),2) AS immediate_percentage
// FROM Delivery
// WHERE (customer_id, order_date) IN
// (
//     SELECT
//     customer_id, MIN(d1.order_date) AS order_date
//     FROM Delivery d1
//     GROUP BY d1.customer_id
// )

// # Write your MySQL query statement below
// SELECT 
//     (SUM(CASE 
//         WHEN d2.order_date = d2.customer_pref_delivery_date 
//         THEN 1 
//         ELSE 0 
//     END)/ COUNT(*)) *100 AS immediate_percentage 
// FROM (
//     SELECT MIN(d1.order_date) AS order_date,
//     customer_pref_delivery_date  
//     FROM Delivery d1
//     GROUP BY d1.customer_id
// )AS d2

