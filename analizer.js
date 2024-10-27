import { readFileSync } from 'fs';
import { parse, visit } from '@solidity-parser/parser';

function analyzeContract(filePath) {
  let content;
  try {
    content = readFileSync(filePath, 'utf8');
  } catch (error) {
    throw new Error(`Error reading file at ${filePath}: ${error.message}`);
  }

  let ast;
  try {
    ast = parse(content);
  } catch (error) {
    throw new Error(`Error parsing Solidity file at ${filePath}: ${error.message}`);
  }

  let events = [];

  function isBalanceCheck(condition) {
    return (
      condition.type === 'BinaryOperation' &&
      condition.operator === '>=' &&
      ((condition.left.type === 'MemberAccess' && condition.left.expression.name === 'msg' && condition.left.memberName === 'value') ||
       (condition.right.type === 'MemberAccess' && condition.right.expression.name === 'msg' && condition.right.memberName === 'value'))
    );
  }

  visit(ast, {
    FunctionDefinition(node) {
      const functionName = node.name || 'constructor';

      // Check for parameters
      if (node.parameters) {
        if (node.parameters.parameters && node.parameters.parameters.length === 0 && functionName !== 'constructor') {
          throw new Error(`No parameters found in function "${functionName}".`);
        }
      }

      // Check visibility of functions
      if (!node.visibility) {
        console.warn(`🟡 Warning: Function "${functionName}" does not have a visibility modifier.`);
      }

      // Reentrancy warning
      const reentrancyFunctions = ['call', 'send', 'transfer'];
      node.body.statements.forEach((stmt) => {
        if (stmt.type === 'ExpressionStatement' && stmt.expression.type === 'FunctionCall') {
          const calledFunction = stmt.expression.expression.name;
          if (reentrancyFunctions.includes(calledFunction)) {
            console.warn(`🟡 Warning: Function "${functionName}" calls "${calledFunction}". Check for potential reentrancy issues.`);
          }
        }
      });
    },

    EventDefinition(node) {
      // Collect all defined events dynamically
      events.push(node.name);
    },

    VariableDeclaration(node) {
      if (node.name === 'tx' && node.typeName.name === 'origin') {
        throw new Error('🟡 Warning: Use of tx.origin detected. This can lead to security issues.');
      }
    }
  });

  // Report on events defined in the contract
  if (events.length === 0) {
    console.warn(`⚪ No events defined in the contract at ${filePath}.`);
  }

  // Check for required events dynamically (if needed, could be adjusted based on context)
  events.forEach((event) => {
    if (!events.includes(event)) {
      throw new Error(`Required event "${event}" is missing from the contract.`);
    }
  });

  console.log('✅ Contract analysis completed');
}

try {
  analyzeContract('./src/contracts/Marketplace.sol');
} catch (error) {
  console.error(error.message);
}

try {
  analyzeContract('./src/contracts/Migrations.sol');
} catch (error) {
  console.error(error.message);
}
