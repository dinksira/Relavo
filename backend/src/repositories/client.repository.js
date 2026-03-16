const supabase = require('../config/supabase');

class ClientRepository {
  async findAll(agencyId) {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('agency_id', agencyId)
      .order('updated_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  async findById(clientId) {
    const { data, error } = await supabase
      .from('clients')
      .select('*, alerts(*), invoices(*), touchpoints(*)')
      .eq('id', clientId)
      .single();

    if (error) throw error;
    return data;
  }

  async create(clientData) {
    const { data, error } = await supabase
      .from('clients')
      .insert([clientData])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async update(clientId, updateData) {
    const { data, error } = await supabase
      .from('clients')
      .update(updateData)
      .eq('id', clientId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async delete(clientId) {
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', clientId);

    if (error) throw error;
    return true;
  }
}

module.exports = new ClientRepository();
