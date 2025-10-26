import { Ticket } from "../ticket";

it("implements optimistic concurrency control (OCC)", async () => {
  // Create a ticket instance
  const ticket = Ticket.build({
    title: "concert",
    price: 5,
    userId: "123",
  });

  // Save to DB
  await ticket.save();

  // Fetch ticket twice
  const firstInstance = await Ticket.findById(ticket.id);
  const secondInstance = await Ticket.findById(ticket.id);

  // Make two separate changes
  firstInstance!.set({ price: 10 });
  secondInstance!.set({ price: 15 });

  // Save first fetched ticket
  await firstInstance!.save();

  // Save second fetched ticket and expect an error
  await expect(secondInstance!.save()).rejects.toThrow();
});

it('increment version number when multiple save', async()=>{
    const ticket = Ticket.build({
        title:"concert",
        price: 5,
        userId:"aaa"
    })
    await ticket.save()
    expect(ticket.version).toEqual(0)
    
    await ticket.save()
    expect(ticket.version).toEqual(1)
    
    await ticket.save()
    expect(ticket.version).toEqual(2)

})